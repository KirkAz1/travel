<template>
  <div class="header-content">
    <!-- 左边文字 -->
    <div class="left-text">
      <h2>轻松探索美丽世界</h2>
      <p>足不出户，以及最轻松的方式探索您想去的任何地方的目的地</p>
      <p>现在就通过我们预定假日套餐的票吧</p>
    </div>

    <!-- 右边不规则图片 -->
    <div class="irregular">
      <img src="/headerPicture.png" alt="图片">
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.header-content {
  display: flex;
  justify-content: space-between; 
  align-items: flex-start;        
  padding: 0 52px;        
  margin-top: 40px;
  position: relative;
}

.left-text {
  max-width: 500px;
  font-size: 20px;
  line-height: 1.6;
  margin-left: 200px;
}

.left-text p {
  margin: 10px 0;
  color: #666;
}

.irregular {
  width: 630px;
  height: 600px;
  overflow: hidden;
  -webkit-mask-image: url('/vector/Irregular.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  -webkit-mask-position: center;
  mask-image: url('/vector/Irregular.png');
  mask-repeat: no-repeat;
  mask-size: cover;
  mask-position: center;
}

.irregular img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
