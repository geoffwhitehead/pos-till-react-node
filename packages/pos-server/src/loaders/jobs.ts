// import config from '../config';
// import EmailSequenceJob from '../jobs/emailSequence';
// import Agenda from 'agenda';

// export default ({ agenda }: { agenda: Agenda }) => {
//     agenda.define(
//         'send-email',
//         { priority: 'high', concurrency: config.agenda.concurrency },
//         new EmailSequenceJob().handler,
//     );

//     agenda.start();
// };
