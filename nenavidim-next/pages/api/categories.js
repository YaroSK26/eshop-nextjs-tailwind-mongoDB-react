import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "../api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    try {
      const categories = await Category.find().populate('parent');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching categories' });
    }
  }

  if (method === 'POST') {
    try {
      const { name, parentCategory, properties } = req.body;
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
      });
      res.json(categoryDoc);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating a category' });
    }
  }

  if (method === 'PUT') {
    try {
      const { name, parentCategory, properties, _id } = req.body;
      const categoryDoc = await Category.findOneAndUpdate(
        { _id },
        { name, parent: parentCategory || undefined, properties },
        { new: true }
      );
      res.json(categoryDoc);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the category' });
    }
  }

  if (method === 'DELETE') {
    try {
      const { _id } = req.query;
      await Category.deleteOne({ _id });
      res.json('ok');
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the category' });
    }
  }
}
