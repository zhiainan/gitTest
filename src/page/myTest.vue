<template>
    <ul class="city-wrapper">
        <li class="city-item" v-for="item in result.data.listRecommend">
            <p>{{item.name}}</p>
            <p>{{item.cityId}}</p>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    import {myTest} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'
    export default {
        data() {
            return {
                result:{}
            }
        },
        created() {
            this.initData();
        },
        methods:{
            async initData() {
                try {
                    this.result = await myTest();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
</script>

<style>

</style>
