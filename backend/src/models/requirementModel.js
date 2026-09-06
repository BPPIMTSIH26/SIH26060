import { Schema, model } from "mongoose";

const requirementSchema = new Schema(
    {
        requirementNumber: {
            type: String,
            required: [
                true,
                "Requirement number is required"
            ],
            unique: true,
            uppercase: true,
            trim: true
        },

        title: {
            type: String,
            required: [
                true,
                "Requirement title is required"
            ],
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        category: {
            type: String,
            enum: [
                "Food",
                "Medical",
                "Scientific Equipment",
                "Fuel",
                "Maintenance",
                "General"
            ],
            required: [
                true,
                "Requirement category is required"
            ]
        },

        quantity: {
            type: Number,
            required: [
                true,
                "Requirement quantity is required"
            ],
            min: [
                1,
                "Quantity must be at least 1"
            ]
        },

        unit: {
            type: String,
            enum: [
                "kg",
                "g",
                "litre",
                "unit",
                "box",
                "packet"
            ],
            default: "unit"
        },

        station: {
            type: Schema.Types.ObjectId,
            ref: "Station",
            required: [
                true,
                "Station is required"
            ]
        },

        priority: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "MEDIUM"
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "FULFILLED",
                "REJECTED",
                "CANCELLED"
            ],
            default: "PENDING"
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Requirement creator is required"
            ]
        },

        processedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        processedAt: {
            type: Date,
            default: null
        },

        fulfilledAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            trim: true,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

requirementSchema.index({
    station: 1,
    status: 1
});

requirementSchema.index({
    createdBy: 1,
    createdAt: -1
});

const Requirement = model(
    "Requirement",
    requirementSchema
);

export default Requirement;