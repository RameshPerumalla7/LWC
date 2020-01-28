const recordMetadata = {
    userId: 'userId',
    id: 'id',
    title: 'title',
    completed: 'completed'
};

export default function fetchDataHelper({ amountOfRecords }) {
    return fetch('https://abcd/todos/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            amountOfRecords,
            recordMetadata,
        }),
    }).then(response => response.json());
}