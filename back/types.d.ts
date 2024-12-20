export interface ICategories{
  id:string,
  title:string,
  description:string,
}
export interface ILocations{
  id:string,
  title:string,
  description:string,
}

export interface IItems{
  id:string,
  categories_id:string,
  locations_id:string
  title:string,
  description:string,
  image:string,
  date:string
}


