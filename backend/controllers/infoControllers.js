const Info = require('../models/infoModel');
const mongoose = require('mongoose');

// get all info
const getInfos = async (req, res) => {
    const user_id = req.user._id

    const infos = await Info.find({user_id}).sort({createdAt: -1})

    res.status(200).json(infos)
}


// get info by user
const getInfo = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'No such Info'})
    }

    const info = await Info.findById(id)

    if(!info) {
        return res.status(400).json({error: ' No such Info'})
    }

    res.status(200).json(info)
}


// create new info
const createInfo = async (req, res) => {
    const {title, bloodpressure, heartrate, bloodsugar} = req.body


    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }
    if(!bloodpressure) {
        emptyFields.push('bloodpressure')
    }
    if(!heartrate) {
        emptyFields.push('heartrate')
    }
    if(!bloodsugar) {
        emptyFields.push('bloodsugar')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

// add doc to db
    try {
        const user_id = req.user._id
        const info = await Info.create({title, bloodpressure, heartrate, bloodsugar, user_id})
        res.status(200).json(info)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// delete info
const deleteInfo = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'No such Info'})
    }

    const info = await Info.findOneAndDelete({_id: id})

    if(!info) {
        return res.status(400).json({error: ' No such Info'})
    }

    res.status(200).json(info)
}

//update info
const updateInfo = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'No such Info'})
    }

    const info = await Info.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!info) {
        return res.status(400).json({error: ' No such Info'})
    }

    res.status(200).json(info)
}



module.exports = {
    getInfo,
    getInfos,
    createInfo,
    deleteInfo,
    updateInfo
}