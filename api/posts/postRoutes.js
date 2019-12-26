const express = require('express');
const postModel = require('./postModel')
const postRouter = express.Router();

postRouter.post('/', async (req, res) => {
    try {
        const postInfo = req.body;
        const fileName = postInfo.fileName
        const transactionHash = postInfo.transactionHash
        const ipfsHash = postInfo.ipfsHash
        // sau khi them bai viet moi, luu thong tin author cua user vua dang nhap
        const newPost = await postModel.create({
            fileName,
            transactionHash,
            ipfsHash
        });
        res.status(201).json({ 
            success: true,
            data: newPost
        });
        
    } catch (error) {
        res.status(error.status || 500).end(error.message || "Internal server error");
    }
});

postRouter.get('/get-page-file', async (req, res) => {
    try {
        const { pageNumber, pageSize } = req.query;

        // validate
        if (isNaN(pageNumber) || isNaN(pageSize)) {
            res.status(500).json({
                success: false,
                message: 'pageNumber && pageSize is invalid'
            })
        }

        if (pageNumber < 1 || pageSize < 1 || pageSize > 20) {
            res.status(500).json({
                success: false,
                message: 'pageNumber && pageSize is invalid'
            })
        }
        // query DB | 1: tang dan | -1: giam dan
        const totalRecord = await postModel.find().countDocuments();
        const data = await postModel.find()
        // const totalRecord = await postModel.find().countDocuments(); // dem tong so ban ghi , de tien cho viec hien thi bao nhieu trang
        // .sort({ dieu kien de sap xep bai post moi nhat })
        // bo qua N phan tu dau tien, de chuyen trang tra ve phan tu tiep theo
        .sort({createdAt: -1}) // giam dan, bai moi' nhat se o tren dau`
        .skip(pageSize * (pageNumber - 1)) 
        // so phan tu muon lay, neu ko thi no se lay tat ca cac phan tu thoa ma dieu kien   
        .limit(Number(pageSize)) 
        .exec();
        res.status(200).json({
            success: true,
            data: data,
            total: totalRecord,
        });
    } catch (error) {
        res.status(500).end(error.message);
    }
});

postRouter.get('/get', async (req, res) => {
    try {
        const result = await postModel.find({})
        console.log(result)
        
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(error.status || 500).end(error.message || "Internal server error");
    }
}) 

postRouter.get('/get/:transactionHash', async (req, res) => {
    try {
        const {transactionHash} = req.params
        const result = await postModel.findOne({transactionHash: transactionHash})
        console.log(result)
        
        res.status(201).json({
            success: true,
            message: 'data ne',
            data: result
        })
    } catch (error) {
        res.status(error.status || 500).end(error.message || "Internal server error");
    }
})

module.exports = postRouter;