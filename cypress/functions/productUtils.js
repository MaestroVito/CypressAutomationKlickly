class ProductUtils
{
    static splitProductTitle(productTitle)
    {
        const firstPart = productTitle.substring(0, 20);
        const secondPart = productTitle.substring(20);
        return { firstPart, secondPart };
    }

}

export default ProductUtils;