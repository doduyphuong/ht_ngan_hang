var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Schema
var History_transfer_schema = new Schema({
    // Số TK người chuyển
    remitter: {
        type: String,
        required: true,
    },
    bank_remitter: {
        type: String,
        required: true,
    },
    // Số TK người nhận
    receiver: {
        type: String,
        required: true,
    },
    bank_receiver: {
        type: String,
        required: true,
    },
    // Số tiền gửi
    deposit_money: {
        type: String,
        required: true,
    },
    // Nội dung
    description: {
        type: String,
        required: true,
    },
    // Hình thức thanh toán phí: "Gửi Trả" or "Nhận Trả"
    // 0: "Gửi Trả", 1: "Nhận Trả"
    type_settle: {
        type: Number,
        required: true,
    },
    // Chi phí giao dịch
    billing_cost: {
        type: String,
        required: true,
    },
    //-1: Rejected(Không chấp nhận), 0: Processing(Đang xử lý), 1: Success (Thành công)
    status_transfer: {
        type: Number,
        required: true,
        default: 0,
    },
    created: {
        type: String,
        required: true,
        lowercase: true,
    },
    modified: {
        type: String,
        required: true,
        lowercase: true,
    },
},
{
    timestamps: true //tự động thêm field createAt và updateAt
});

module.exports = mongoose.model('History_transfer', History_transfer_schema, "history_transfer"); // model name, schema name, collection name 