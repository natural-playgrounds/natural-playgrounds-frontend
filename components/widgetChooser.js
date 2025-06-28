import Text from "./widget/text";
import NaturalImage from "./widget/images";
import Link from "next/link";
import Image from "next/image";
import SectionGrid from "./widget/section_grid";
import Title from "./widget/title";
import Leaf from "../images/leaf.jpg";
import Bark from "../images/bark.jpg";
import Manufacturing from "../images/manufacturing.png";
import Design from "../images/design.png";
import Store from "./store";
import YoutubeEmbed from "./widget/youtube";
import ContactUs from "./widget/contact_us";
export default function WidgetChooser({ obj, results, category }) {
  return (
    <div className={obj.margin}>
      {obj.widget_type === "Image/Text" && (
        <div className="relative">
          <div
            className={`wide-load flex flex-col ${
              obj.structure === "Text Right"
                ? "md:flex-row"
                : "md:flex-row-reverse space-x-reverse-important"
            } space-y-8 md:space-y-0 md:space-x-12`}
          >
            <div className="w-full md:w-1/2 h-full items-center align-center justify-center flex flex-col space-y-8">
              {obj.image_one_url && (
                <div className="w-full flex justify-start">
                  <div className="relative w-full h-full">
                    {obj.image_one_url && (
                      <NaturalImage obj={obj} image={obj.image_one_url} />
                    )}
                  </div>
                </div>
              )}
              {obj.image_two_url && (
                <div className="w-full  flex justify-start">
                  <div className="relative w-full h-full">
                    {obj.image_two_url && (
                      <NaturalImage obj={obj} image={obj.image_two_url} />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 h-full">
              <Text title={obj.title} content={obj.content} />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Text/CTA" && (
        <div className="relative">
          <div
            className={`wide-load flex flex-col ${
              obj.structure === "Text Right"
                ? "md:flex-row"
                : "md:flex-row-reverse space-x-reverse-important"
            } space-y-8 md:space-y-0 md:space-x-12`}
          >
            <div className="w-full md:w-1/2 h-full">
              <Text title={obj.title} content={obj.content} />
            </div>
            {obj.cta_link && (
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-8">
                <Title title={obj.cta_title} added_class="text-center" />
                <div className="py-4 flex">
                  <Link href={obj.cta_link} className="relative border-8 border-dark-green px-16 py-6 overflow-hidden no-underline">
                    <div className="absolute inset-0">
                      <Image
                        className="w-full h-full object-cover"
                        src={Bark}
                        alt="CTA Bark"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <p className="relative font-bold text-lg uppercase">
                      {obj.cta_text}
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {obj.widget_type === "Services Grid" && (
        <div className="relative">
          <div className="wide-load flex flex-col md:flex-row md:space-x-12">
            <div className="w-full md:w-1/2 flex flex-col">
              <SectionGrid
                title={obj.service_one_title}
                logo={obj.service_one_logo_url}
                image={obj.service_one_image_url}
                content={obj.service_one_content}
                link={obj.service_one_url}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <SectionGrid
                title={obj.service_two_title}
                logo={obj.service_two_logo_url}
                image={obj.service_two_image_url}
                content={obj.service_two_content}
                link={obj.service_two_url}
              />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Gallery" && (
        <div className="relative">
          <div className="wide-load space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8">
            {obj.gallery &&
              obj.gallery.map((gallery, idx) => (
                <div
                  className="col-span-2 sm:col-span-1 flex flex-col"
                  key={idx}
                >
                  <Link href={`/gallery/${gallery.slug}`}>
                    <div className="relative image">
                      {gallery.image_url && (
                        <Image
                          className="object-cover shadow-lg"
                          src={gallery.image_url}
                          alt={gallery.title || "Gallery image"}
                          fill
                        />
                      )}
                    </div>
                    <div className="relative p-8">
                      <h3 className="text-xl font-semibold text-center uppercase">
                        {gallery.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
      {obj.widget_type === "News Release" && (
        <div className="relative">
          <div className="wide-load">
            <div className="max-w-2xl  space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8">
              {obj.news_releases &&
                obj.news_releases.map((news, idx) => (
                  <div
                    className="col-span-2 sm:col-span-1 flex flex-col"
                    key={idx}
                  >
                    <div className="relative image h-full">
                      <Link href={news.url} className="cursor-pointer">
                        {news.image_url && (
                          <Image
                            className="object-cover"
                            src={news.image_url}
                            alt={news.title || "News article image"}
                            fill
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Testimonial" && (
        <div className="relative">
          <div className="wide-load flex flex-col md:flex-row space-x-12">
            <div className="w-full md:w-1/2 h-full">
              {obj.image_one_url && (
                <NaturalImage obj={obj} image={obj.image_one_url} />
              )}
            </div>
            <div className="w-full md:w-1/2 h-full">
              <blockquote
                className="prose"
                dangerouslySetInnerHTML={{ __html: obj.content }}
              />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Homepage Hero" && (
        <div className="relative">
          <div className="wide-load flex flex-col md:flex-row md:space-x-12">
            <div className="w-full md:w-1/2 h-full">
              <Text content={obj.homepage_left_text} />
            </div>
            <div className="w-full md:w-1/2 h-full">
              <Text content={obj.homepage_right_text} />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Store" && (
        <div className="relative">
          <div className="wide-load">
            <div className="w-full justify-center flex flex-col items-center">
              <Title title="Shop our Store" />
            </div>
            <div>
              <Store category={category} />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Services" && (
        <div className="relative">
          <div className="flex flex-col services py-8 items-center">
            <div className="wide-load">
              <div className="w-full justify-center flex flex-col items-center">
                <Title title={obj.title} />
              </div>
            </div>
            <div className="wide-load w-full pt-8">
              <div className="w-full flex flex-col md:flex-row space-y-6 md:space-y-0">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative w-3/4 h-64">
                    <Image
                      className="object-cover "
                      src={obj.image_one_url}
                      alt={obj.image_one_alt_text}
                      fill
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col space-y-12 items-center">
                  <div>
                    <Link href="/manufacturing" className="flex flex-col items-center no-underline">
                      <Image
                        src={Manufacturing}
                        width={50}
                        height={50}
                        alt="Manufacturing Image"
                      />
                      <h3 className="mt-4">Manufacturing</h3>
                    </Link>
                  </div>
                  <div>
                    <Link href="/design" className="flex flex-col items-center no-underline">
                      <Image
                        src={Design}
                        width={50}
                        height={50}
                        alt="Design Image"
                      />
                      <h3 className="mt-4">Design</h3>
                    </Link>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative w-3/4 h-64">
                    <Image
                      className="object-cover"
                      src={obj.image_two_url}
                      alt={obj.image_two_alt_text}
                      fill
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Full Width Text" && (
        <div className="relative">
          <div className="wide-load flex flex-col space-y-6">
            <div className="w-full justify-start flex flex-col items-start">
              <Title title={obj.title} added_class="full-text" />
            </div>
            <div className="w-full flex">
              <Text content={obj.content} added_class="full-text" />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Grey Box" && (
        <div className="container mx-auto items-center  max-w-[70rem]">
          <div className="flex flex-col space-y-6 p-16 grey-box">
            <div className="w-full justify-center flex flex-col items-center">
              <Title title={obj.title} added_class="full-text" />
            </div>
            <div className="w-full flex">
              <Text content={obj.content} added_class="full-text" />
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Leafs" && (
        <div className="relative">
          <div className="wide-load flex flex-col space-y-6">
            <div className="w-full justify-center flex flex-col items-center">
              <Title title={obj.title} added_class="full-text" />
            </div>
            <div className="space-y-12 sm:grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8">
              {obj.leafs &&
                Object.keys(obj.leafs).map((key) => (
                  <div
                    className="relative flex items-start space-x-3"
                    key={key}
                  >
                    <div className="flex-shrink-0 w-12">
                      <Image
                        className="h-6 w-6 rounded-full"
                        src={Leaf}
                        alt="Leaf icon"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-lg font-medium text-gray-900">
                        {obj.leafs[key].content}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Tips" && (
        <div className="relative bg-concrete">
          <div className="wide-load flex flex-col space-y-6 py-12">
            <div className="w-full justify-center flex flex-col items-center">
              <Title title={obj.title} added_class="full-text" />
            </div>
            <div className="space-y-12 sm:grid grid-cols-1 sm:grid-cols-2 grid-rows-5 sm:gap-12 sm:space-y-0 lg:gap-x-8">
              {obj.tips &&
                Object.keys(obj.tips).map((key) => (
                  <div className="relative flex flex-col items-start" key={key}>
                    <h3 className="w-full text-dark-green font-semibold mb-2">
                      {obj.tips[key].title}
                    </h3>
                    <div
                      className="ml-12 text-md text-blue-green font-light w-full"
                      dangerouslySetInnerHTML={{
                        __html: obj.tips[key].content,
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Full Width CTA" && (
        <div className="relative">
          <div className="wide-load flex flex-col space-y-6">
            <div className="w-full justify-center flex flex-col items-center">
              <Link href={obj.cta_link} className="relative border-8 border-dark-green px-16 py-6 overflow-hidden no-underline">
                <div className="absolute inset-0">
                  <Image
                    className="w-full h-full object-cover"
                    src={Bark}
                    alt="CTA Bark"
                  />
                </div>
                <p className="relative font-bold text-lg uppercase">
                  {obj.cta_text}
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Full Width Image" && (
        <div>
          {obj.title && (
            <div className="wide-load w-full justify-start flex flex-col items-start">
              <h3
                className="full-text text-2xl pb-4 text-dark-green"
                dangerouslySetInnerHTML={{ __html: obj.title }}
              />
            </div>
          )}
          <div className="relative h-[600px]">
            <div className="absolute inset-0">
              {obj.image_one_url && (
                <Image
                  className="h-full w-full object-cover z-[10000]"
                  src={obj.image_one_url}
                  alt={obj.image_one_alt_text}
                  fill
                />
              )}
              <div className="absolute inset-0"></div>
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Wood Section" && (
        <div className="mt-0">
          <div className="relative">
            <div className="absolute inset-0 top-[-64px]">
              <Image
                className="h-full w-full object-cover"
                src={Bark}
                alt="Decorative Tree Bark"
              />
              <div className="absolute inset-0 "></div>
            </div>
            <div className="relative">
              <div className="flex flex-col space-y-6 pb-6 wide-load">
                <div className="w-full justify-center flex flex-col items-center wide-load">
                  <Title title={obj.title} added_class="wood" />
                </div>
                <div className="flex items-center mx-auto text-center wide-load">
                  <Text content={obj.content} added_class="wood" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Learn More" && (
        <div className="relative">
          <div className="flex flex-col md:space-x-12 learn-more py-6 wide-load w-full">
            <div>
              <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative w-3/4 h-64">
                    {obj.image_one_url && (
                      <NaturalImage
                        obj={obj}
                        image={obj.image_one_url}
                        alt_text={obj.image_one_alt_text}
                      />
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col space-y-8 items-center justify-end">
                  <Link href="/about" className="cursor-pointer no-underline">
                    <Title title={obj.title} added_class="learn-more " />
                  </Link>
                  <Link href="/about" className="cursor-pointer">
                    Our Company
                  </Link>
                  <Link href="/faq" className="cursor-pointer">
                    Everything else about Natural Playgrounds
                  </Link>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative w-3/4 h-64">
                    {obj.image_two_url && (
                      <NaturalImage
                        obj={obj}
                        image={obj.image_two_url}
                        alt_text={obj.image_two_alt_text}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {obj.widget_type === "Contact Us" && <ContactUs />}
      {obj.widget_type === "Videos" && (
        <div className="relative">
          <div className="wide-load flex flex-col">
            <div className="w-full justify-center flex flex-col items-center">
              <Title title="Videos" />
            </div>
            <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {obj.video_link_one && (
                <div className="mx-auto w-2/3 md:w-1/2 lg:w-1/4">
                  <div className="relative w-full overflow-hidden">
                    <YoutubeEmbed embedId={obj.video_link_one} />
                  </div>
                </div>
              )}
              {obj.video_link_two && (
                <div className="mx-auto w-2/3 md:w-1/2 lg:w-1/4">
                  <div className="relative w-full overflow-hidden">
                    <YoutubeEmbed embedId={obj.video_link_two} />
                  </div>
                </div>
              )}
              {obj.video_link_three && (
                <div className="mx-auto w-2/3 md:w-1/2 lg:w-1/4">
                  <div className="relative w-full overflow-hidden">
                    <YoutubeEmbed embedId={obj.video_link_three} />
                  </div>
                </div>
              )}
              {obj.video_link_four && (
                <div className="mx-auto w-2/3 md:w-1/2 lg:w-1/4">
                  <div className="relative w-full overflow-hidden">
                    <YoutubeEmbed embedId={obj.video_link_four} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {obj.green_bottom && (
        <div
          className={`${obj.green_bottom ? "green-bottom-border" : ""}`}
        ></div>
      )}
    </div>
  );
}
