import { OrderStatus } from "@sjoedwards/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";

// This looks a lot like ticket/models/ticket.ts...
// Can we abstract it into a shared library? Absolutely not
// Each microservice has its own database, so the model for the data which is going to be stored is also unique
// Therefore two type definitions are required

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// Export so we can import into the order
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      // Ret is the value directly before the document is turned into JSON
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Needed for tracking the version for concurrency issues in listeners
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// Statics adds to the model
ticketSchema.statics.build = ({ id, title, price }: TicketAttrs) => {
  return new Ticket({ _id: id, title, price });
};

// Methods adds to the document

// Make sure the ticket isn't already reserved
// Run query to look at orders and find ticket where one just fetched and orders status is *not* cancelled
ticketSchema.methods.isReserved = async function () {
  // This is equal to the document that we just called 'isReserved' on
  // Arrow function would relate to the function itself
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created ||
          OrderStatus.AwaitingPayment ||
          OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

// This has to go below the schema, otherwise the static methods are not included
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
