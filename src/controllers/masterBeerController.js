import {MasterBeer} from "../models/master/masterBeerModel.js"

export const getAllMasterBeers =async (req,res)=>{
    try{
        const beers= await MasterBeer.find();
        if(beers.length==0){
            return res.status(404).json({success:false,message:"No beers found"});
        }
        return res.status(200).json({success:true,message:"Successfully fetched",beers})

    }
    catch(e){
        return res.status(500).json({success:false,message:"Failed to fetch beer data"})
    }
}


export const insertManyBeers =async(req,res)=>{
    try{
        await MasterBeer.insertMany(req.body);
        return res.status(200).json({success:true,message:"Successfully Created"});
    }
    catch(e){
        return res.status(500).json({success:false,message:"Failed to insert beer data"});
    }
}

