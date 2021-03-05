import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import mongoose from "mongoose";

// This looks a lot like ticket/orders/ticket.ts...
// Can we abstract it into a shared library? Absolutely not
// Each microservice has its own database, so the model for the data which is going to be stored is also unique
// Therefore two type definitions are required
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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
    },
    userId: {
      type: String,
      required: true,
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

// Only want to include this when its the PRIMARY service (normally where it was created)
// This is to prevent missing versions on different services
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
// This has to go below the schema, otherwise the static methods are not included
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
