export const getOne = model => async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  const doc = await model.findOne({ _id: id, createdBy: userId }).exec()

  if (!doc) {
    return res.status(404).end()
  }

  // res.send({ data: doc }) It will work but test is expecting res.json
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const userId = req.user._id
  const docs = await model.find({ createdBy: userId }).exec()
  res.status(200).json({ data: docs })
}

export const createOne = model => async (req, res) => {
  const userId = req.user._id
  const doc = await model.create({ ...req.body, createdBy: userId })
  res.status(201).json({ data: doc })
  // 201 for post req
}

export const updateOne = model => async (req, res) => {
  const userId = req.user._id
  const doc = await model.findOneAndUpdate(
    { _id: req.params.id, createdBy: userId },
    req.body,
    {
      // get updated object back
      new: true
    }
  )

  if (!doc) {
    return res.status(400).end()
  }

  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const { id } = req.params
  const userId = req.user._id
  const doc = await model
    .findOneAndRemove({ _id: id, createdBy: userId })
    .exec()

  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
