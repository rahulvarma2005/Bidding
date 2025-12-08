import React, { useEffect, useState } from "react";
import ProductHeader from "../components/ProductsDetails/ProductHeader";
import UserSmallCard from "../components/ProductsDetails/UserSmallCard";
import ProductGallery from "../components/ProductsDetails/ProductGallery";
import ProductInfo from "../components/ProductsDetails/ProductInfo";
import BidSection from "../components/ProductsDetails/BidSection";
import ProductTags from "../components/ProductsDetails/ProductTags";
import ProductDescription from "../components/ProductsDetails/ProductDescription";
import CommentSection from "../components/ProductsDetails/CommentSection";
import UserOtherListings from "../components/UserOtherListings";
import ManageProductDetails from "../components/ProductsDetails/ManageProductDetails";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState();
  const [productUser, setProductUser] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [error, setError] = useState();
  const { productId } = useParams();

  const fetchProduct = async () => {
    setError("");
    try {
      const currentUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Parsiraj currentUser iz localStorage ako postoji
      if (currentUser) {
        setCurrentUser(JSON.parse(currentUser));
      }

      const response = await fetch(
        `http://localhost:8081/api/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setError("Error while fetching product");
        console.log(error);
      }

      const data = await response.json();
      setProduct(data);
      setProductUser(data.user);
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchProduct();
  }, [productId]);

  // Provera da li je trenutni korisnik vlasnik proizvoda
  const isProductOwner = currentUser?.id === productUser?.id;

  return (
    <>
      <div className="w-full bg-gradient-to-br from-purple-50 flex px-20 space-x-10 items-start mt-8">
        <div className="w-8/12">
          <div className="bg-white px-6 py-4 rounded-md shadow-md">
            <ProductHeader
              name={product?.name}
              description={product?.description}
            />
            <ProductGallery></ProductGallery>
          </div>

          <ProductTags></ProductTags>
          <ProductDescription description={product?.description}></ProductDescription>
          <CommentSection productId={product?.id}></CommentSection>
          <UserOtherListings userId={product?.user?.id}></UserOtherListings>
        </div>

        <div className="w-4/12">
          <UserSmallCard
            userId={product?.user?.id}
            username={product?.user?.username}
            email={product?.user?.email}
          ></UserSmallCard>
          <ProductInfo
            bidStatus={product?.productStatus}
            startingPrice={product?.startingPrice}
            closesIn={product?.endTime}
          ></ProductInfo>
          <BidSection productId={product?.id} productStatus={product?.productStatus}></BidSection>

          {/* Show ManageProductDetails only if user is product owner */}
          {isProductOwner && (
            <ManageProductDetails
              productId={product?.id}
              currentProductName={product?.name}
              onProductUpdate={(updatedProduct) => {
                setProduct(updatedProduct);
                // Dodatna logika ako je potrebno
              }}
              onProductDelete={() => {
                // Dodatna logika prije brisanja ako je potrebno
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
