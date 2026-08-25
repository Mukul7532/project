import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: [true, 'aggregateId is required'],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'eventType is required'],
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'payload is required'],
    },
    timestamp: {
      type: Date,
      required: [true, 'timestamp is required'],
      default: () => new Date(),
      immutable: true,
    },
    version: {
      type: Number,
      required: [true, 'version is required'],
      min: [1, 'version must be a positive integer'],
      validate: {
        validator(value) {
          return Number.isInteger(value) && value > 0
        },
        message: 'version must be a positive integer',
      },
    },
  },
  {
    collection: 'events',
    timestamps: false,
    strict: true,
  },
)

eventSchema.index({ aggregateId: 1 }, { name: 'idx_events_aggregate_id' })
eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true, name: 'idx_events_aggregate_version_unique' })

eventSchema.pre('save', function (next) {
  if (this.isNew) {
    return next()
  }

  const error = new Error('Event store is append-only; updates and deletes are not allowed.')
  return next(error)
})

eventSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'findOneAndReplace', 'replaceOne', 'deleteOne', 'deleteMany', 'findOneAndDelete'], function () {
  throw new Error('Event store is append-only; updates and deletes are not allowed.')
})

const Event = mongoose.model('Event', eventSchema)

export default Event
