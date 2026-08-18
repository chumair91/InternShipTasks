const adminAuth=(req,res,next)=>{
    if (req.user.role!='admin') {
        return res.status(403).json({
            success:false,
            message:'admin only'
        })
        
    }
    next()
}

module.exports=adminAuth;