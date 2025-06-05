interface SiteInfoType {
  is_product: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  international_phone: string;
  international_address: string;
  logo_url: string;
  favicon_url: string;
  agency_url: string;
  passenger_url: string;
  driver_url: string;
  web_url: string;
  facebook_link: string;
  instagram_link: string;
  linkedin_link: string;
  google_link: string;
  passenger_android_link: string;
  passenger_ios_link: string;
  driver_android_link: string;
  driver_ios_link: string;
  terms_url: string;
  privacy_url: string;
  timezone: string;
  text_download_app: string;
  date_format: string;
  time_format_24: number;
  hour_limit: number;
  tag_line: string;
  show_company_name: number;
  whatsapp_number: string;
  stripe_public_key: string;
  google_analytics_code: string;
  google_conversion_code: string;
  google_conversion_label: string;
  google_conversion_page_slug: string;
  booking_redirect_url: string;
  other_script: string;
  other_script_1: string;
  other_script_2: string;
  microsoft_clarity_script: string;
  cookies_script: string;
  schema_script_org: string;
  google_site_verification_code: string;
}

type StepStatus = "current" | "complete" | "upcoming";

type Step = {
  id: number;
  title: string;
  status: StepStatus;
};

export interface Card {
  image_link: string;
  [key: string]: any;
}

export interface CarSeat {
  name: string;
  key_name: string;
  [key: string]: any; // Add more properties if needed
}

export interface Fleet {
  class_name: string;
  type_name: string;
  image_link: string;
  fare: string; // e.g., "$169.80", use `number` if it's a parsed value
  fleet_id: number;
  passenger: number;
  luggage: number;
  baby_seat: number;
  car_seats: CarSeat[];
}

export interface PolylinePoints {
  [key: string]: any;
}

export interface QuoteDetails {
  card: Card;
  distance: string;
  duration: string;
  fleets: Fleet[];
  from_lat: number;
  from_lng: number;
  from_location: string;
  is_airport: number;
  journey_type: "one_way" | "return";
  passenger: number;
  pickup_date: string;
  pickup_time: string;
  polyline_points: PolylinePoints;
  quote_id: string;
  return_date: string;
  return_time: string;
  service_type: string;
  to_lat: number;
  to_lng: number;
  to_location: string;
  via: any[];
}
