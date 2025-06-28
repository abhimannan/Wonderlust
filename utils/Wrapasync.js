let Wrapasync = (fn)=>{
    return (req,resp,next) =>{
        fn(req,resp,next).catch((e)=>{
            next(e);
        });
    }
}
module.exports = Wrapasync;
