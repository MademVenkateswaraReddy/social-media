import mysql from 'mysql2';

const connection = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password: '996689',
    database:'social_media'
}).promise()

export async function readPost(){
    const output = await connection.query("select * from posts")
    return output[0]
}

export async function readUser(profile){
    const output = await connection.query("select * from users where profile='"+profile+"'")
    return output[0]
}
export async function insertUser(name, profile, password, headline){
    const output = await connection.query("insert into users (name, profile, password, headline) values ('"+name+"', '"+profile+"', '"+password+"', '"+headline+"')")
}
export async function insertPost(profile, content){
    const output = await connection.query("insert into posts (profile, content) values ('"+profile+"', '"+content+"')")
}
export async function likeFun(content) {
    const output = await connection.query("select likes from posts where content='" + content + "'");
    const post = output[0][0];
  
    if (post && post.likes !== undefined) {
      const likes = post.likes;
      const incLikes = likes + 1;
      await connection.query("update posts set likes=" + incLikes + " where content='" + content + "'");
    }
  }
  
  export async function shareFun(content) {
    const output = await connection.query("select share from posts where content='" + content + "'");
    const post = output[0][0];
  
    if (post && post.share !== undefined) {
      const share = post.share;
      const incShare = share + 1;
      await connection.query("update posts set share=" + incShare + " where content='" + content + "'");
    }
  }
export async function deleteFun(content){
    await connection.query("delete from posts where content='"+content+"'")
}
