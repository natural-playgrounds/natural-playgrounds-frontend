import { useCartSlide } from "../hooks/use-cart-slide.js";
export default function Testimonial() {
  const { testimonial, updateTestimonial } = useCartSlide();
  return (
    <>
      <div className="relative bg-tan min-h-[128px]">
        {testimonial && (
          <div className="wide-load flex flex-col md:flex-row py-2">
            <div className="w-1/4 hidden md:block"></div>
            <div className="w-full md:w:3/4 h-full">
              <blockquote className="testimonial relative">
                <div className="ml-12 my-8 relative">
                  <p className="text-2xl font-light mb-6">
                    What our customers are saying
                  </p>
                  <div
                    className="text-xl"
                    dangerouslySetInnerHTML={{ __html: testimonial }}
                  />
                </div>
              </blockquote>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
