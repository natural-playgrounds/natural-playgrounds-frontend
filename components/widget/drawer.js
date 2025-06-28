import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
export default function Drawer({ product, three, category }) {
  return (
    <div className="gray-outline cursor-pointer">
      <Link
        href={{
          pathname: "/products/",
          query: { category_search: category.name },
        }}
        className="no-underline"
      >
        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
          <div>
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={`Category Image for ${category.name}`}
                className="w-full h-full object-center object-cover group-hover:opacity-75"
                fill
                priority={true}
              />
            ) : (
              <div className="w-full h-full object-center object-cover sm:w-full sm:h-full"></div>
            )}
          </div>
        </div>
        <div>
          <p className="text-xl font-bold pt-2">{category.name}</p>
        </div>
      </Link>
    </div>
  );
}
