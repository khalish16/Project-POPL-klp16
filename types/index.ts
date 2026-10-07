export type ApiResult<T=unknown> = {success:true;data:T}|{success:false;message:string};
