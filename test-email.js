const { Resend } = require('resend');

const resend = new Resend('re_j4ZGya1w_4CPWrjfqn5RtBf6jTr3U74ue');

(async function () {
    try {
        const { data, error } = await resend.emails.send({
            from: 'hello@injectorindex.com',
            to: 'urielpro78@gmail.com',
            subject: 'Resend Test Delivery for InjectorIndex',
            html: '<strong>It works!</strong> Your domain authentication looks solid.'
        });

        if (error) {
            return console.error({ error });
        }

        console.log({ data });
    } catch (err) {
        console.error({ err });
    }
})();
