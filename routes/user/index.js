const router  = require('express').Router();
const user    = require('../../controllers/user');

router.post('/register', user.register);
router.patch('/update/:userId', user.update);
router.delete('/remove', user.remove);

module.exports = router;
