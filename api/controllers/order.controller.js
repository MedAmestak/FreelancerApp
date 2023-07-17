import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Mission from "../models/mission.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {

  const stripe = new Stripe(process.env.STRIPE);

  const mission = await Mission.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({

    amount: mission.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    missionId: mission._id,
    img: mission.cover,
    title: mission.title,
    buyerId: id,
    sellerId: mission.userId,
    price: mission.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  const id = req.params.id.trim()

  try {

    const orders = await Order.find({
       buyerId: id ,
    });


    res.status(200).send(orders);
  } catch (err) {
    console.log(err, 'ghaalat')
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

export const submitMission = async (req, res, next) => {
  try {
    const id = req.params.id.trim()

    console.log("Inside submitMission function"); 
    console.log("id_____",id )//
    const mission = await Mission.findById(id);
    console.log("Mission:", mission); //


    const newOrder = new Order({
      missionId: mission._id,
      img: mission.cover,
      title: mission.title,
      buyerId: req.userId,
      sellerId: mission.userId,
      price: mission.price,
      payment_intent: null, // 
    });
    console.log("New Order:", newOrder); //


    await newOrder.save();

    res.status(200).send({
      orderId: newOrder._id, // Send the created order ID to the frontend
    });
  } catch (error) {
    next(error);
  }
};