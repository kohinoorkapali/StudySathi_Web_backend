const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
 const UserMock = dbMock.define('User',{
    id : 1,
    fullname: 'Test product',
    username:'kohinoor',
    email: 'kohinoor@gmail.com',
    password: '123456',
 })

describe ('User Model', () =>{
    it ('should register a person', async () =>{
        const user = await UserMock.create({
            fullname: 'New Person',
            username: 'new',
            email: 'test@gmail.com',
            password: '111111'
        });

        
expect(user.fullname).toBe('New Person');
expect(user.username).toBe('new');
expect(user.email).toBe('test@gmail.com');
expect(user.password).toBe('111111');

    });
    
it ('should require user fullname , username and email and password', async ()=>{
        await expect(UserMock.create({})).rejects.toThrow();

})
})


