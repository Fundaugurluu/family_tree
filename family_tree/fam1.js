const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models/Person');

const app = express();
const PORT = 3030;

app.use(bodyParser.json());

const dbURL = 'mongodb+srv://fundauggurlu:funda@cluster0.ohggs1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB bağlantısı sağlandı');
        app.listen(PORT, () => {
            console.log(`Server ${PORT} portunda çalışıyor`);
        });
    })
    .catch(err => console.log('MongoDB bağlantı hatası:', err));


app.post('/persons', async (req, res) => {
    const { name, parents, siblings, children, cousins } = req.body;
    try {
           const newPerson = new Person({ name, parents, siblings, children, cousins });
           await newPerson.save();
           res.status(201).send(`kisi ${name} eklendi.`);
    } catch (err) {
        
        console.error('kisi ekleme hatası:', err);
        res.status(500).send('kisi eklenirken hata');
    }
});


app.get('/persons/:name', async (req, res) => {
          const { name } = req.params;
    try {
        const person = await Person.findOne({ name }).populate('parents siblings children cousins');
      
        if (person) {
            res.send(person);
        } else 
        {
            res.status(404).send('kisi  bulunamadı.');
        }
    } catch (err)
    {
        console.error('kisi arama hatası:', err);
        res.status(500).send('kisi aranirken hata');
    }
});


app.get('/persons/:name/relative/:relativeType', async (req, res) => {
    const { name, relativeType } = req.params;
    try {
        const person = await Person.findOne({ name }).populate('parents siblings children cousins');
        if (!person) {
            return res.status(404).send('kisi bulunamadı.');
        }

        let relatives = [];

        switch (relativeType) {
            case 'parents':
                    relatives = person.parents;
                break;
            case 'siblings':
                 relatives = person.siblings;
                break;
            case 'children':
                  relatives = person.children;
                break;
            case 'cousins':
                for (const parent of person.parents) {
                    const parentWithSiblings = await Person.findById(parent._id).populate('siblings');
                    for (const sibling of parentWithSiblings.siblings) {
                        const siblingWithChildren = await Person.findById(sibling._id).populate('children');
                        relatives = relatives.concat(siblingWithChildren.children);
                    }
                }
                break;
            default:
                return res.status(400).send('gecersiz akraba turu.');
        }

        res.send(relatives);
    } catch (err) {
        console.error('arama hatası:', err);
        res.status(500).send('akraba aranirken hata');
    }
});





app.put('/persons/:name', async (req, res) => {
           const { name } = req.params;
    const { parents, siblings, children, cousins } = req.body;
    try {
        const updatedPerson = await Person.findOneAndUpdate(
            { name },
            { parents, siblings, children, cousins },
            { new: true, runValidators: true } 
        );

        if (updatedPerson) {
            res.send(`Kişi ${name} güncellendi.`);
        } else {
            res.status(404).send('Kişi bulunamadı.');
        }
    } catch (err) {
        console.error('Kişi güncelleme hatası:', err);
        res.status(500).send('Kişi güncellenirken hata oluştu.');
    }
});



app.get('/persons/:name/relative/:relativeType/:targetRelativeType', async (req, res) => {
    const { name, relativeType, targetRelativeType } = req.params;
    try {
        const person = await Person.findOne({ name }).populate('parents siblings children cousins');
        if (!person) {
            return res.status(404).send('Kişi bulunamadı.');
        }

           let targetRelatives = [];
         let relatives = [];

        switch (relativeType) {
            case 'parents':
                relatives = person.parents;
                break;
            case 'siblings':
                relatives = person.siblings;
                break;
            case 'children':
                relatives = person.children;
                break;
            case 'cousins':
                for (const parent of person.parents) {
                    const parentWithSiblings = await Person.findById(parent._id).populate('siblings');
                    for (const sibling of parentWithSiblings.siblings) {
                        const siblingWithChildren = await Person.findById(sibling._id).populate('children');
                        relatives = relatives.concat(siblingWithChildren.children);
                    }
                }
                break;
            default:
                return res.status(400).send('Geçersiz akraba türü.');
        }

        for (const relative of relatives) {
            const populatedRelative = await Person.findById(relative._id).populate(targetRelativeType);
            targetRelatives = targetRelatives.concat(populatedRelative[targetRelativeType]);
        }

        res.send(targetRelatives);
    } catch (err) {
        console.error('akraba arama hatasi', err);
        res.status(500).send('akraba aranirken hata');
    }
});
