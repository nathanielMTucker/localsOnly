const {CREATE_LOCAL} = require('./utils/localQueries');
const {UPDATE_USER_OWNS, GET_USER_OWNS} = require('./utils/userQueries')
const sendQuery = require('./utils/sendQueries');
const router = require('express').Router();

router.route('/createLocal').post(async (req, res)=>{
            
            const {owner : id, address, details, hours, coors, images} = req.body;
            console.log(images);
            
            let variables = {
                name : address.name,
                description : details.description,
                website : address.web,
                city : address.city.toLowerCase(),
                phoneNumber : address.tel,
                state : address.state.toLowerCase(),
                geo : {
                    lat : String(coors.lat),
                    lng : String(coors.lng)
                },
                price : Number(details.price),
                hours : hours,
                rating : Number(details.rating),
                localsOnly : details.localsOnly,
                address : {
                    street : address.street,
                    apt : address.apt,
                    city : address.city.toLowerCase(),
                    state : address.state.toLowerCase(),
                    zip : address.zip
                },
                quick : {
                    dogFriendly: details.dog,
                    twentyOnePlus: details.adult,
                    takeout: details.takeout,
                    familyFriendly: details.family,
                    dineIn: details.dinein,
                    delivery: details.delivery,
                },
                owner : id,
                reviewCount : 1,
                hashtags : details.tags,
                images : images
        };
    
        try {        
                const {createLocal: createdLocal} = await sendQuery(CREATE_LOCAL, variables);
                // console.log(createdLocal);
                const {_id} = createdLocal;
                
                const {findUserByID} = await sendQuery(GET_USER_OWNS, {id});
                let {owns} = findUserByID;
                // console.log(owns);
                owns = [...owns, _id];
                // console.log(owns);
                // const {updateUser : {owns : updatedOwns}} = 
                await sendQuery(UPDATE_USER_OWNS, {id, data : {owns}})
                // console.log(updatedOwns);
                res.status(200).json(createdLocal);
                
        }catch(err){
            console.error(err);
            return {err:'Something went wrong'}
        }
    }
)

module.exports = router;