import { Item } from './item.model'
import mongoose from 'mongoose'
import { connect } from '../../utils/db'

// Recives an object or array of objects
// Item.create({ })

const run = async () => {
  await connect('mongodb://localhost:27017/api-test')
  // const item = await Item.create({
  //   name: 'test',
  //   createdBy: mongoose.Types.ObjectId(),
  //   list: mongoose.Types.ObjectId()
  // })
  // console.log(item)
  // const updated = await Item.findByIdAndUpdate(
  //   item._id,
  //   { name: 'eat' },
  //   { new: true }
  // ).exec()
  // console.log(updated);
  const removed = await Item.findByIdAndRemove(
    '5c81d08b918c6f7f212c9b13'
  ).exec()
  console.log(removed)
}

run()
