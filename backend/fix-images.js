import mongoose from 'mongoose';

const uri = 'mongodb+srv://nicky2603:naveen2603@cluster03.atbl7to.mongodb.net/MedFix';

mongoose.connect(uri).then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  const products = await Product.find({});
  let count = 0;
  for (let p of products) {
    if (p.imageUrl && p.imageUrl.includes('http://localhost:5001')) {
      const fixed = p.imageUrl.replace('http://localhost:5001', '');
      await Product.updateOne({ _id: p._id }, { $set: { imageUrl: fixed } });
      console.log('Fixed:', p.name, '->', fixed);
      count++;
    }
  }
  console.log('\nDone! Fixed ' + count + ' products.');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
