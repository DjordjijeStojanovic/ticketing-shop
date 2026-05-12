export enum Subjects {
    TicketCreated = 'ticket-created',
    OrderUpdated = 'order-updated'
}

const testSubject = (subject: Subjects) => {
    console.log(subject);
};

testSubject(Subjects.TicketCreated);