<template>
    <div>
        <!-- <el-button type="primary" @click='queryPlant'>加载方案</el-button> -->
        <p>电源方案: {{  plant.name }}</p>
        <el-form label-position="top">
            <el-card label="plant" v-for="sub in plant.subs" :key="sub.guid" >
                <template #header>{{  sub.name }}</template>
                <el-form-item v-for="setting in sub.settings" :key="setting.guid" >
                    <template #label>{{ setting.name }} <span v-if="setting.unit">({{ setting.unit}})</span></template>
                    <div v-if="setting.items">
                        <div>
                            {{ac_name}}:
                            <el-radio-group v-model="setting.ac" @change="change('ac',sub.guid,setting.guid,setting.ac)" >
                                <el-radio v-for="item in setting.items" :key="item.guid" :label="item.value">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div>
                            {{dc_name}}:
                            <el-radio-group v-model="setting.dc" @change="change('dc',sub.guid,setting.guid,setting.dc)">
                                <el-radio v-for="item in setting.items" :key="item.guid" :label="item.value">{{ item.label }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <ul v-else>
                        <li>
                            {{ac_name}}: <el-input v-model="setting.ac" style="display: inline-block;width:auto" @change="change('ac',sub.guid,setting.guid,setting.ac)"></el-input>
                        </li>
                        <li>
                            {{dc_name}}: <el-input v-model="setting.dc" style="display: inline-block;width:auto" @change="change('dc',sub.guid,setting.guid,setting.dc)"></el-input>
                        </li>
                    </ul>
                </el-form-item>
            </el-card>
        </el-form>
    </div>
</template>
<script>

export default {
    mounted(){
        this.queryPlant()
    },
    data:function(){
        return {
            ac_name:'插入电源时',
            dc_name:'使用电池时',
            // plant: require('@/data/power_plant.json')
            plant : {}
        }
    },
    computed:{
    },
    setup(){
    },
    methods:{
        queryPlant(){
            window.myapi.queryPowerPlant().then(res=>{
                this.plant = res
            })
        },
        change(type,sub_guid,setting_guid,value){
            window.myapi.setPowerPlant(type,this.plant.guid,sub_guid,setting_guid,value).then(res=>{
                if( res ) this.$message.success('设置成功')
                else this.$message.error('设置失败')
                this.queryPlant()
            })
        },
    }
}
</script>
<style scoped>
.el-card { margin-bottom: 15px;}
ul { list-style: none;padding: 0}
</style>