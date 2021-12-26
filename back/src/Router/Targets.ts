import { DB } from '../db/index'
import { MessageResponse } from '../interface/MessageResponse'
import { Router } from 'express'
import { FindOptions } from 'sequelize'

const TargetsRouter:Router = Router()

//=====================================
/*
get /targets
post /targets
get /targets/:targetId
delete /targets/:targetId
*/
//=====================================

TargetsRouter.get('/', async(req, res) => {
    const limit = (req.query.limit == null ? 20 : Number(req.query.limit))
    const pages = (req.query.pages == null ? 1 : Number(req.query.pages))
    const offset = limit * (pages - 1)
    let options:FindOptions = {
        limit: limit,
        offset: offset
    }
    if (req.query.userId != null) {
        options.where = {
            userId: req.query.userId
        }
    }

    const Targets = await DB.Targets.findAll(options)
    res.status(200).json(Targets)
})
TargetsRouter.get('/:targetId', async(req, res) => {
    const options = {
        where: {
            id: req.params.targetId
        }
    }
    const Target = await DB.Targets.findOne(options);

    if (Target) {
        res.status(200).json(Target)
    } else {
        const resMes: MessageResponse = {
            status: "Info",
            message: "Not Found"
        }
        res.status(404).json(resMes)
    }
})

TargetsRouter.post('/', async(req, res) => {
    //本来は認証から受け取る
    const userId = 0

    if (req.body.title != null) {
        const Data = {
            userId: userId,
            title: req.body.title
        }
        const Target = await DB.Targets.create(Data)

        res.status(200).json(Target)
    } else {
        const resMes: MessageResponse = {
            status: "Error",
            message: "Not Enogth Property"
        }
        res.status(403).json(resMes)
    }
})
TargetsRouter.delete('/:targetId', async(req, res) => {
    if (req.params.targetId != null) {
        const options = {
            where: {
                id: req.params.targetId
            }
        }
        const dbRes = await DB.Targets.destroy(options)

        if (dbRes) {
            const resMes: MessageResponse = {
                status: "success",
                message: "Deleted"
            }
            res.status(200).json(resMes)
        } else {
            const resMes: MessageResponse = {
                status: "Error",
                message: "Not Found"
            }
            res.status(404).json(resMes)
        }
    } else {
        const resMes: MessageResponse = {
            status: "Error",
            message: "Not Enogth Property"
        }
        res.status(403).json(resMes)
    }
})
//=====================================
export {
    TargetsRouter
}