// Mock the User model used in your controller
const User = require("./models/User.js") ; 
const userController = require ( "../controllers/userController.js");

// Mock Sequelize model methods
jest.mock("../models/User.js", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
}));

describe('User Controller', () =>{
    const mockResponse =()=> {
        const res = mockResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it ('should create a new product', async () =>{
        const req = {body: {fullname: '', username: '', email: '', password: ''}};
        const res = mockResponse();
        User.findAll.mockResolvedValue(req.body);

        await userController.createProduct(req, res);
        expect (res.status).toHaveBeenCalledWith(201);
        espect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
    
    });

    it ('should return all users'  , async () => {
        const req = {},
        const res = mockResponse();

    })
})
