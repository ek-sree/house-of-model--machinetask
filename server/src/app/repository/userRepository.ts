import { IOffer, IProduct } from "../../interface/productInterface";
import offerModel from "../model/offerModel";
import productModel from "../model/productModel";

export default class UserRepository{
    findAllProduct = async(page: number, limit: number, sort: string, search: string): Promise<{data: IProduct[]} | null> => {
        try {
            const skip = (page - 1) * limit;
            let sortOption = {};
            console.log("---->>>>sort",sort);
            console.log("---->>>>page",page);
            console.log("---->>>>page",limit);
            console.log("---->>>>search",search);
            
            switch(sort) {
                case 'lowPrice':
                    sortOption = { productPrice: 1 };
                    break;
                case 'topRated':
                    sortOption = { rating: -1 };
                    break;
                case 'recommended':
                default:
                    sortOption = { createdAt: -1 };
            }
    
            let query: any = {isStatus:true};
            if (search) {
                const searchTerms = search.toLowerCase().split(/,|\s+/).filter(term => term.length > 0);
                const pricePattern = /(\d+)/;
                const underPattern = /under/i;
    
                let itemTerms: string[] = [];
                let maxPrice: number | undefined;
    
                searchTerms.forEach((term, index) => {
                    if (pricePattern.test(term)) {
                        const price = parseInt(term);
                        if (!isNaN(price)) {
                            if (index > 0 && underPattern.test(searchTerms[index - 1])) {
                                maxPrice = price;
                            } else if (!maxPrice) {
                                maxPrice = price;
                            }
                        }
                    } else if (!underPattern.test(term)) {
                        itemTerms.push(term);
                    }
                });
    
                const itemQuery = itemTerms.map(term => ({
                    $or: [
                        { productName: { $regex: term, $options: 'i' } },
                        { productShorts: { $regex: term, $options: 'i' } },
                        { productDescription: { $regex: term, $options: 'i' } }
                    ]
                }));
    
                query.$and = itemQuery;
    
                if (maxPrice) {
                    query.$and.push({ productPrice: { $lte: maxPrice } });
                }
            }
    
            const products = await productModel.find(query).sort(sortOption).skip(skip).limit(limit);
            console.log("why?",products);
            
            return {data: products};
        } catch (error) {
            console.log("Error Fetching product", error);
            return null;
        }
    }


    findSingleProduct= async(productId:string): Promise<{data:IProduct} | null> =>{
        try {
            const product = await productModel.findById(productId)
            console.log(product);
            
            if(!product){
                return null
            }
            return {data:product}
        } catch (error) {
            console.log("Error Fetching single product",error);
            return null
        }
    }

    findOffer = async():Promise<{data:IOffer[]}| null>=>{
        try {
            const offer = await offerModel.find({isStatus:true});
            return {data:offer}
        } catch (error) {
            console.log("Error Fetching offer product",error);
            return null
        }
    }
}