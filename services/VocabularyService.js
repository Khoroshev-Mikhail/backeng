const db = require("../db");
const methods = ['russian', 'english', 'spelling', 'auding'] // Можно положить внутрь класса
class VocabularyService {
    //при записи слова в вокабуляр надо возвращать новый вокабуляр
    //может быть отдельной строкой для каждого метода и отдельно их и хранить в бд и сторе. Но наверно это имеет смысл делать для оптимизации когда проект уже будет большой и важна будет скорость, пока что можно и так
    async getOne (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        const data = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [id]);
        
        return data
    }
    async getSpellVocabulary (id, groupId){
        if(!id || !groupId){
            throw new Error('Не указан id пользователя или группы.')
        }
        const vocabulary = await db.one('SELECT spelling FROM user_vocabulary WHERE id_user = $1', [id]);
        const group = await db.any('SELECT words.id, words.eng, words.rus, words.img, words.audio FROM words LEFT JOIN groups ON words.id = ANY(groups.words) WHERE groups.id = $1', [groupId]);
        const unlernedGroup = group.filter(el => !vocabulary.spelling.includes(el.id) && el.rus && el.eng)
        if(unlernedGroup.length === 0){
            return null
        }
        const index = Math.floor(Math.random() * unlernedGroup.length)
        const trueVariant = unlernedGroup[index]
        return trueVariant
    }
    
    async getGroupProgress (id, groupId){
        if(!id || !groupId){
            throw new Error('Не указан id пользователя или группы.')
        }
        const vocabulary = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [id]);
        const { words: groupWords } = await db.one('SELECT words FROM groups WHERE id = $1', [groupId]);
        const result = {}
        const idsLerned = {}
        for(const key in vocabulary){
            const lerned = groupWords.filter(el => vocabulary[key].includes(el))
            result[key] = Math.round(lerned.length / (groupWords.length) * 100)
            idsLerned[key] = lerned
        }
        const total = []
        for(let key in groupWords){
            const x = groupWords[key]
            if(idsLerned.english.includes(x) && idsLerned.russian.includes(x) && idsLerned.auding.includes(x) && idsLerned.spelling.includes(x)){
                total.push(x)
            }
        }
        result.total = Math.round(total.length / (groupWords.length) * 100)
        return result
    }
    async getVocabularyByMethod (id, method, groupId){
        if(!id || !method){
            throw new Error('Не указан id.')
        }
        if(!['russian', 'english', 'spelling', 'auding'].includes(method)){  //spelling? либо убери отсюда либо удали предыдущий метод в классе отдельный для spelling
            throw new Error('Не верно указан метод изучения')
        }

        function falseVariants(vocabular, trueVariant){
            const count = vocabular.length - 1 <= 3 ? vocabular.length - 1 : 3 //Может быть в будущем предоставить на выбор клиенту количество вариантов для ответа
            let uniqueSet = new Set();
            uniqueSet.add(trueVariant)
            while(uniqueSet.size <= count){
                const item = vocabular[Math.floor(Math.random() * vocabular.length)]
                if(item.eng && item.rus){
                    uniqueSet.add(item)
                }
            }
            return Array.from(uniqueSet).sort(() => Math.random() - 0.5)
        }

        const vocabulary = await db.one('SELECT $1~ FROM user_vocabulary WHERE id_user = $2', [method, id]);
        const group = await db.manyOrNone('SELECT words.id, words.eng, words.rus, words.img, words.audio FROM words LEFT JOIN groups ON words.id = ANY(groups.words) WHERE groups.id = $1', [groupId]);
        const unlernedGroup = group.filter(el => !vocabulary[method].includes(el.id) && el.rus && el.eng)
        if(unlernedGroup.length === 0){
            return null
        }
        const index = Math.floor(Math.random() * unlernedGroup.length)
        const trueVariant = unlernedGroup[index]
        const falseVariant = falseVariants(group, trueVariant)
        return { trueVariant, falseVariant }
    }
    async update (id, word_id, method){
        if(!id || !word_id || !method){
            throw new Error('Не указан id пользователя или слова.')
        }
        if(!['russian', 'english', 'spelling', 'auding'].includes(method)){ 
            throw new Error('Не верно указан метод изучения')
        }
        await db.none('UPDATE user_vocabulary SET $1~ = $1~ || $2 WHERE id_user = $3', [method, word_id, id])
        const data = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [id]);
        return data
    }
    async delete (id, word_id, method){
        if(!id || !word_id || !method){
            throw new Error('Не указан id пользователя или слова.')
        }
        if(!['russian', 'english', 'spelling', 'auding'].includes(method)){ 
            throw new Error('Не верно указан метод изучения')
        }
        await db.none('UPDATE user_vocabulary SET $1~ = array_remove($1~, $2) WHERE id_user = $3', [method, word_id, id])
        const data = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [id]);
        return data
    }
};

module.exports = new VocabularyService();