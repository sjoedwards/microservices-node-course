import mongoose from "mongoose";

// This looks a lot like ticket/models/ticket.ts...
// Can we abstract it into a shared library? Absolutely not
// Each microservice has its own database, so the model for the data which is going to be stored is also unique
// Therefore two type definitions are required

interface TicketAttrs {
  title: string;
  price: number;
}

// Export so we can import into the order
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
// This has to go below the schema, otherwise the static methods are not included
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
