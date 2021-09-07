const MongoClient = require('mongodb').MongoClient; // 로드
const url = "mongodb://localhost:27017";    //  접속 url
const dbName = "mydb";

//  클라이언트 생성
// const client = new MongoClient(url, { useNewUrlParser: true });


//  접속 테스트
function testConnect() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        //  콜백
        /*
        if (err) {
            console.error(err);
        } else {
            console.log(client);
            client.close();
        }
        */
        client.connect()
        .then(client => {
            //  성공시
            console.log(client);
            client.close();
        })
        .catch(reason => {
            console.error(reason);
        })
    });
}
// testConnect();

//  한개 문서 insert
//  INSERT INTO mydb.friends VALUE(...);
//  db.friends.insert({ 문서 })
function testInsertOne(name) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect()
    .then(client => {
        //  DB 선택
        const db = client.db("mydb");
        //  컬렉션 선택 후 쿼리 수행
        // console.log(db.collection("mydb"));
        db.collection("friends").insertOne({ name: name })
        .then(result => {
            console.log(result);
            console.log("새로 삽입된 문서의 ID:", result.insertedId);
            client.close();
        });
    })
    .catch(reason => {
        console.log(reason);
    })
}
// testInsertOne("홍길동");

//  다수 문서 삽입
//  INSERT INTO friends VALUE(...), (...), (...)
//  db.friends.insertMany([ { 문서 }, { 문서 }, ...])
function testInsertMany(names) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    console.log(names, "는 배열?", Array.isArray(names));
    if (Array.isArray(names)) { //  names가 배열
        client.connect()
        .then(client => {
            const db = client.db("mydb");

            let data = names.map(item => {
                return {name: item};
            }); //  문서의 배열 생성
            console.log("삽입될 문서 목록:", data);
            db.collection("friends").insertMany(data)
            //  insertMany는 문서의 배열이 필요
            .then(result => {
                console.log(result.insertedCount, "개 삽입");
                client.close();
            })
        })
    } else if(!Array.isArray(names)){
        //  배열이 아니면
        testInsertOne(names);
    }
    // client.close();
}
// testInsertMany(["고길동", "둘리", "도우너"]);
// testInsertMany("징하다키스칸");

function testDeletAll() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect()
    .then(client =>
        {
            const db = client.db("mydb");
            db.collection("friends").deleteMany({})
            .then(result =>{
                console.log(result.deletedCount);
                client.close();
            })
        })
}
testDeletAll();

function testInsertOneDOC(doc) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect()
    .then(client =>{
        const db = client.db("mydb");
        db.collection("friends").insertOne(doc)
        .then(result => {
            console.log(result.insertedId);
            client.close();
        })
        .catch(reason =>
                {
                    console.error(reason);
                })
    })
}
// testInsertOneDOC({name:"임꺽정",job:"도적"});

function testInsertManyDoc(docs) {    
    const client = new MongoClient(url, { useNewUrlParser: true });
    if (Array.isArray(docs)) { //  names가 배열
        client.connect()
        .then(client => {
            const db = client.db("mydb");
    
            db.collection("friends").insertMany(docs)
            //  insertMany는 문서의 배열이 필요
            .then(result => {
                console.log(result.insertedCount, "개 삽입");
                client.close();
            })
        })
    }
}


testInsertManyDoc(
    [{name: '고길동', gender: '남성', species: '인간', age: 50 },
     {name: '둘리', gender: '남성', species: '공룡', age: 100000000},
     {name: '도우너', gender: '남성', species: '외계인', age: 15},
     {name: '또치', gender: '여성', species: '조류', age: 15},
     {name: '영희', gender: '여성', species: '인간', age: 12}]
);


// 내보낼이름 = 객체이름
exports.testInsertOneDOC =testInsertOneDOC;
exports.testDeletAll = testDeletAll;
exports.testInsertMany = testInsertMany;

function testUpdateByJob(name,job) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect()
    .then(client =>{
        const db = client.db("mydb");
        db.collection("friends").updateMany(
            { name: name}, /* 조건 객체 */
            {
                $set: { job: job }  //  $set 연산자 필수
            }
        ).then(result => {
            console.log(result.modifiedCount, "개 업데이트,",
                        result.upsertedCount, "개 업서트");
        }).then(() => {
            client.close();
        })
    })
}
testUpdateByJob("고길동", "직장인");