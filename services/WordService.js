import db from "../db";
import { unlink } from 'node:fs/promises';

class WordService {
    audioTypes = ['audio/wave', 'audio/wav', 'audio/x-wav', 'audio/x-pn-wav', 'audio/webm', 'audio/ogg', 'audio/mpeg3', 'audio/x-mpeg-3', 'audio/mpeg']
    imgTypes = ['image/jpeg', 'image/png', 'image/jp2']
    mediaPath = __dirname + '/../public'
    async getAll (){
        return await db.manyOrNone('SELECT * FROM words');
    }
    async searchWords (str = ''){
        if(typeof str !== 'string'){
            throw new Error('Не правильный формат строки')
        }
        // const data = await db.manyOrNone(`SELECT * FROM words WHERE eng ~~* $1 OR rus ~~* $1 OR rus ~~* $2`, [`%${str}%`, `%${str[0].toUpperCase() + str.substr(1)}%`]); //Русские символы почему то ищет с учетом регистра
        const data = await db.manyOrNone(`SELECT * FROM words WHERE eng ~~* $1 OR rus ~~* $1`, [`%${str.toLowerCase()}%`]);
        return data
    }
    async getOne (id){
        return await db.one('SELECT * FROM words WHERE id = $1', [id]);
    }
    async add (eng, rus, img, audio){
        const { id } = await db.one('INSERT INTO words(eng, rus) VALUES($1, $2) RETURNING id', [eng.toLowerCase(), rus.toLowerCase()])
        await this.addImg(id, img)
        await this.addAudio(id, audio)
        return await db.one('SELECT * FROM words WHERE id = $1', [id])
    }

    async addImg (id, img){
        if(! id ){
            throw new Error('Не указан id слова.')
        }
        if(! img ){
            throw new Error('На сервер не было загружено изображение.')
        }
        if(! this.imgTypes.includes(img.mimetype) ){
            throw new Error('Не подходящий формат изображения.')
        }
        const { eng } = await db.oneOrNone('SELECT eng FROM words WHERE id = $1', [id])
        if(! eng ){
            throw new Error('Не правильно указан id слова или у слова отсутствует значение eng.')
        }
        const imgFileName = id + '_' + eng + img.name.match(/\.[\w\d]+$/i)[0]
        const imgUploadPath = this.mediaPath + '/img/' + imgFileName;
        await img.mv(imgUploadPath, function(err) {
            if (err) {
                throw new Error('Ошибка при загрузке изображения.')
            }
        });
        await db.none('UPDATE words SET img = $2 WHERE id = $1', [id, imgFileName])
        return await db.one('SELECT * FROM words WHERE id = $1', [id])
    }
    async addAudio (id, audio){
        if(! id){
            throw new Error('Не указан id слова.')
        }
        if(! audio){
            throw new Error('На сервер не было загружено изображение.')
        }
        if(! this.audioTypes.includes(audio.mimetype)){
            throw new Error('Не подходящий формат изображения.')
        }
        const { eng } = await db.oneOrNone('SELECT eng FROM words WHERE id = $1', [id])
        if(! eng ){
            throw new Error('Не правильно указан id слова или у слова отсутствует значение eng.')
        }
        const audioFileName = id + '_' + eng + audio.name.match(/\.[\w\d]+$/i)[0]
        const audioUploadPath =  this.mediaPath + '/audio/' + audioFileName;
        await audio.mv(audioUploadPath, function(err) {
            if (err) {
                throw new Error('Ошибка при загрузке аудио файла.')
            }
        });
        await db.none('UPDATE words SET audio = $2 WHERE id = $1', [id, audioFileName])
        return await db.one('SELECT * FROM words WHERE id = $1', [id])
    }
    async update (id, eng, rus, img, audio){
        if(! id ){
            throw new Error('Не указан id слова.')
        }
        const word = await db.one("SELECT * FROM words WHERE id = $1", [id])
        if(! word ){
            throw new Error('Несуществующий id слова.')
        }
        if(img){
            try{
                await unlink(this.mediaPath + '/img/' + word.img);
            }catch(e){
                console.log(e.message)
            }finally{
                await this.addImg(id, img)
            }
        }
        if(audio){
            try{
                await unlink(this.mediaPath + '/audio/' + word.audio);
            }catch(e){
                console.log(e.message)
            }finally{
                await this.addAudio(id, audio)
            }
        }
        if(eng && rus){
            await db.none('UPDATE words SET eng = $1, rus = $2 WHERE id = $3', [eng.toLowerCase(), rus.toLowerCase(), id])
        }
        return await db.one('SELECT * FROM words WHERE id = $1', [id])
    }

    async delete (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        const { img, audio } = await db.one('SELECT * FROM words WHERE id = $1', [id])
        await db.none('DELETE FROM words WHERE id = $1', [id])

        // Может добавить условие там где есть?
        await db.none('UPDATE user_vocabulary SET english = array_remove(english, $1)', [id])
        await db.none('UPDATE user_vocabulary SET russian = array_remove(russian, $1)', [id])
        await db.none('UPDATE user_vocabulary SET spelling = array_remove(spelling, $1)', [id])
        await db.none('UPDATE user_vocabulary SET auding = array_remove(auding, $1)', [id])
        // Удалить из всех групп
        await db.none('UPDATE groups SET words = array_remove(words, $1)', [id])
        //Удалить медиафайлы
        await unlink(this.mediaPath + '/img/' + img)
        await unlink(this.mediaPath + '/audio/' + audio);
        return await db.none('SELECT id FROM words WHERE id = $1', [id])
    }
    async getAllGroupsIncludesWord (id_word){
        if(!id){
            throw new Error('Не указан id слова.')
        }
        return await db.manyOrNone('SELECT * FROM groups WHERE $1 = ANY(words)', [id_word]);
    }
};

module.exports = new WordService();