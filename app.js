async function getRuleByVariant(variantID, productID) {
    let data = window.otDataQuantityPriceShop.quantity;
    let result = []
    // lay het cac rule theo variant, product, collection cac function viet trong file chung app.js
    RuleForVariantByVariantID = await getRuleForVariantByVariantID(data.variant, variantID);
    if ((Array.isArray(RuleForVariantByVariantID) == true) && (RuleForVariantByVariantID.length > 0)) {
        result['contentOffer'] = RuleForVariantByVariantID;
        result['typeOffer'] = 'variant';
    } else {
        RuleForVariantByProductID = await getRuleForVariantByProductID(data.product, productID);
        if ((Array.isArray(RuleForVariantByProductID) == true) && (RuleForVariantByProductID.length > 0)) {
            result['contentOffer'] = RuleForVariantByProductID;
            result['typeOffer'] = 'product';
        } else {
            checkExistCollectionByProduct = await checkExistCollectionByProduct(data.collection, productID);
            if ((Array.isArray(checkExistCollectionByProduct) == true) && (checkExistCollectionByProduct.length > 0)) {
                result['contentOffer'] = checkExistCollectionByProduct;
                result['typeOffer'] = 'collection';
            } else {
                RuleForGlobal = await getRuleForGlobal(data.global);
                result['contentOffer'] = RuleForGlobal;
                result['typeOffer'] = 'global';
            }
        }
    }
    return result;

    // cac rule dc uu tien cho variant -> product -> custome collection -> smart collection
    // check neu khong ton tai rule cho variant thi lay rule cho product
}

async function getRuleByVariant(variantID, productID) {
    let data = window.otDataQuantityPriceShop.quantity;
    let result = []
    // lay het cac rule theo variant, product, collection cac function viet trong file chung app.js
    RuleForVariantByVariantID = await getRuleForVariantByVariantID(data.variant, variantID);
    if ((Array.isArray(RuleForVariantByVariantID) == true) && (RuleForVariantByVariantID.length > 0)) {
        result['contentOffer'] = RuleForVariantByVariantID;
        result['typeOffer'] = 'variant';
    } else {
        RuleForVariantByProductID = await getRuleForVariantByProductID(data.product, productID);
        if ((Array.isArray(RuleForVariantByProductID) == true) && (RuleForVariantByProductID.length > 0)) {
            result['contentOffer'] = RuleForVariantByProductID;
            result['typeOffer'] = 'product';
        } else {
            checkExistCollectionByProduct = await checkExistCollectionByProduct(data.collection, productID);
            if ((Array.isArray(checkExistCollectionByProduct) == true) && (checkExistCollectionByProduct.length > 0)) {
                result['contentOffer'] = checkExistCollectionByProduct;
                result['typeOffer'] = 'collection';
            } else {
                RuleForGlobal = await getRuleForGlobal(data.global);
                result['contentOffer'] = RuleForGlobal;
                result['typeOffer'] = 'global';
            }
        }
    }
    return result;
    // cac rule dc uu tien cho variant -> product -> custome collection -> smart collection
    // check neu khong ton tai rule cho variant thi lay rule cho product
}