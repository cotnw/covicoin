const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Session = require('../models/Session');
const Lead = require('../models/Lead');

router.get('/', (req, res) => {
    res.send('hello world');
});

router.post('/', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    req.body.formData = JSON.parse(req.body.formData)
    if (session) {
        let searchLead = await Lead.findOne({ session_id: session._id, is_active: true })
        if (searchLead) {
            res.sendStatus(404)
        } else {
            let lead = new Lead({
                session_id: session._id,
                user_token: req.query.token,
                address1: req.body.formData.address1,
                address2: req.body.formData.address2,
                item: req.body.formData.item,
                quantity: req.body.formData.quantity,
                contact_name: req.body.formData.contactName,
                contact_number1: req.body.formData.contactNumber1,
                contact_number2: req.body.formData.contactNumber2,
                additional_info: req.body.formData.addl_info,
                date: new Date(),
                proof_ocr_text: req.body.ocrText,
                generated_reply: req.body.generatedReply
            })
            lead.save()
            res.redirect(`verify/1?token=${req.query.token}`)
        }
    } else {
        res.sendStatus(404)
    }
    console.log(req.body)
});

router.get('/1', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (session) {
        let lead = await Lead.findOne({ session_id: session._id, user_token: req.query.token })
            // Search on Twitter and confirm if user has commented the generated reply or not and set verify1 accordingly
    } else {
        res.sendStatus(404)
    }
})

router.get('/2', async(req, res) => {
    let session = await Session.findOne({ user_token: req.query.token, is_active: true })
    if (session) {
        let lead = await Lead.findOne({ session_id: session._id, user_token: req.query.token })
            // Search keywords in OCR Text and set verify2 to true in lead
    } else {
        res.sendStatus(404)
    }
})

module.exports = router