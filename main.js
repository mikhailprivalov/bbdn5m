import {Telegraf} from 'telegraf';
import moment from 'moment';
import gm from 'gm';
import {CronJob} from 'cron';
import http from 'http';
import path from "path";

const __dirname = process.cwd();

const bot = new Telegraf(process.env.BOT_TOKEN);

const chatId = 'blin_blinski_ng';

function declOfNum(n, text_forms) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) {
        return text_forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return text_forms[1];
    }
    if (n1 === 1) {
        return text_forms[0];
    }
    return text_forms[2];
}

const textsOfKuzya = [
    'Потеря потерь!',
    'Блин блинский!',
    'Это подстава подстав!',
    'А у тебя клюв вместо носа!',
    'Меня зовут MC Кузя, мой рэп звучит как автомат UZI!',
    'Сильвестр Андреевич, вы такой умный. Не зря у вас лоб на полбашки.',
    'А вы как человек — дерьмо! Извините. (к Сильвестру Андреевичу)',
    'Шняга шняжная, жизнь общажная: беспонтовая, но кайфовая!',
    'Гошан, ты пьёшь слишком много кофе. Это очень вредно, потому что в кофе содержится кокаин.',
    'А ещё я хочу кроссовки, как у Чака Норриса, 43 и 44-го размера, ну, чтобы зимой с тёплым носком носить. А ещё зуб золотой, как в фильме «Кровавый спорт». Круто?',
    'А у нас в комнате никого нет, только Герман. Но вы не бойтесь, он тихий, я его бью.',
    'Там олигарх один, Онанус… Онанис…',
    'Крутяк!',
    'Пиво хорошее, а хозяева — козлы!',
    'Сижу и дудю, а велосипед — тютю!',
    'Чё сидим, чё не дудим?',
    'Пельмеши с кетченезом — это ваще!',
    'Вижу, дом наш бревенчатый, а на пороге дед, Царствие ему Небесное, карасей солью натирает, Царствие им Небесное.',
    'У меня вот тётку в Кургане чуть на Масленицу не сожгли. А чё? Все перепились, а она пошла с чучелом фотографироваться.',
    'У меня своя комната только два года была, пока брат сидел.',
    'Я те щас жбан проломлю! (в обращении к Суслопарову)',
    'Ты чё, не знаешь секрет секрета?! Узнал один — узнают все!',
    'Он меня стариком называет!',
    'Батя свой самогон настаивает… на конском навозе.',
    'Ещё раз батин самогон бадягой назовёшь, я те твою кудрявую кукушку снесу!',
    'Это твоя тёлка — телка, а моя телка — девушка!',
    'До чего дошел прогресс — появился кетчонез!',
    'Я опоздал, потому что во сне думал, что не сплю.',
    'Как это они так встречаются, если они не встречаются?!',
    'Ну это... Я так далеко не продумывал.',
    'Ещё раз так сделаешь, никогда больше так делать не сможешь!',
    'Я придумал, что надо сделать, чтобы философия обратно не вытекла!',
    'Время подобно песчинкам, которые сыпятся сквозь пальцы жизни, пересчитать их невозможно, но когда-нибудь ладонь сознания будет пуста, песчинки сольются друг с другом и образуют вечность.',
];

const textsOfSasha = [
    'Папа, не лезь в мою жизнь!',
    'Ну, ПАПА!',
    'И не нужны мне твои деньги! Я астроном!',
    'Папа, что ты сюда как на работу ходишь?',
    'Она даже когда колбасу режет, она у неё невкусная получается.',
    'Здесь все так расслабляются, что я начинаю напрягаться!',
    'Когда мужчина надевает обручальное кольцо, он сразу же превращается из симпатичного парня в какого-то женатого мужика.',
];

const textsOfSilvester = [
    'Ты сперва мозги себе новые купи!',
    'Меня даже факт твоего существования бесит. (в обращении к Кузе)',
    'Атлет.',
    'Нужны деньги? Так на! Возьми у меня! (в обращении к Саше)',
    'Привет, тупорез! (в обращении к Кузе)',
    'Привет, качок! (в обращении к Кузе)',
    'Вы хотите, чтобы я сказал своему охраннику навалять охраннику Мартынова?… Гена, срочно ко мне!',
    'Слышь, иди и деградируй подальше от моего сына!',
    'Ну, что ты копаешься, как восьмиклассник с бюстгальтером!',
    'Че ржете, обормоты?',
    'Саша, организм это не казахские партнёры, его не обманешь.',
    'Не ровняйся на меня! Я уже все сделал: дом построил, сына вырастил, кого надо посадил!',
    'Слезы, сопли, слюни — женские жидкости, а мужские — коньяк, вискарь и на утро минералка.',
    'После того, что произошло, кризис обязан на мне жениться.',
    'Я вам что, памятник, чтобы около меня целоваться?',
    'У тебя нет денег? Это у меня нет денег! И ты даже не представляешь, сколько у меня нет денег!',
];

const texts = {
    'Кузя': textsOfKuzya,
    'Саша': textsOfSasha,
    'Сильвестр Андреевич': textsOfSilvester,
};

const getMind = () => {
    const ks = Object.keys(texts);
    const kks = [];
    for (const k of ks) {
        for (let i = 0; i < texts[k].length; i++) {
            kks.push(k);
        }
    }
    const k = kks[Math.floor(Math.random() * kks.length)];
    const ts = texts[k];

    return [k, ts[Math.floor(Math.random() * ts.length)]];
};

const sendToChannel = async () => {
    sendMessage(chatId, ...(await getMessage()));
};

const getDiffs = () => {
    const d1 = moment().add(1, 'year').startOf('year');
    const d2 = moment();
    const diffMinutes = d1.diff(d2, 'minutes');
    const diffDays = d1.diff(d2, 'days') + 1;
    return [diffMinutes, diffDays];
};

const getMessages = (who, what) => {
    const [diffMinutes, diffDays] = getDiffs();
    return [
        'До Нового Года',
        `${diffMinutes} ${declOfNum(diffMinutes, ['минута', 'минуты', 'минут'])}`,
        `🗓 ${diffDays} ${declOfNum(diffDays, ['день', 'дней', 'дня'])}`,
        `💭 ${what}`,
    ];
};

const getMessage = async () => {
    const [who, what] = getMind();
    const [pc1, pc2, ...rest] = getMessages(who, what);
    const photoPath = await makePhoto(pc1, pc2, who);

    console.log({photoPath});

    return [
        photoPath,
        rest.join('\n'),
    ];
};

const makePhoto = (pc1, pc2, who) => {
    return new Promise(resolve => {
        let base = 'bbbase.png';
        if (who === 'Саша') {
            base = 'bbsasha.png';
        }
        if (who === 'Сильвестр Андреевич') {
            base = 'bbsil.png';
        }
        gm(path.resolve(__dirname, base))
            .noProfile()
            .font(path.resolve(__dirname, 'FreeSans.ttf'))
            .fill('#000000')
            .fontSize(30)
            .drawText(140, -40, pc1, 'center')
            .fill('#ff0000')
            .fontSize(46)
            .drawText(140, 10, pc2, 'center')
            .write(path.resolve(__dirname, 'bbres.png'), (e) => {
                if (e) {
                    console.log('ERROR');
                    console.log(e);
                }
                resolve(path.resolve(__dirname, 'bbres.png'));
            });
    });
};

const sendMessage = (chatId, photo, message) => {
    bot.telegram.sendPhoto(chatId, {source: photo}, {caption: message});
};

bot.on('text', async ctx => {
    sendMessage(ctx.message.chat.id, ...(await getMessage()));
});

bot.launch();

const job = new CronJob('0 0 11,20 * * *', function () {
    console.log('WOW1');
    sendToChannel();
}, null, true, 'Europe/Moscow');

job.start();

const requestHandler = (request, response) => {
    console.log(request.url)
    response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler);
server.listen(Number(process.env.PORT) || 3000, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${Number(process.env.PORT) || 3000}`)
})


process.once('SIGINT', () => {
    bot.stop('SIGINT');
    job.stop();
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    job.stop();
});
