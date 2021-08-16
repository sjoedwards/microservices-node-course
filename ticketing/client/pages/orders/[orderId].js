import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order.expiresAt]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time Left: {timeLeft} seconds
      <StripeCheckout
        token={(token) => console.log(token)}
        stripeKey="pk_test_51JNeZgFs37KqPeg2X3SmbCURukMiSVtciXbb3x04Vd9khqp6OnTno6WjPX1SkSESilqGDQplZ9AQkOKiDySq2WDf00p3o4qSZR"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
