export const campaigns = {
data:function() {
    return {
        parent: "",
        data: {
            items: []
        },
        loader: 0,
        date: "",
        date2: ""
    }
},
    mounted:function(){
        this.parent = this.$parent.$parent;

        if(!this.parent.user){
            this.parent.logout();
        }
        console.log(this.parent.formData.all);
        this.get();
        this.GetFirstAndLastDate();
    },
    methods:{
        GetFirstAndLastDate:function() {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var firstDayOfMonth = new Date(year, month, 2);
            var lastDayOfMonth = new Date(year, month+1, 1);

            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
        },
        get:function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            if(this.date!="") data.append('date',this.date);
            if(this.date2!="") data.append('date2',this.date2);
            self.loader=1;
            axios.post(this.parent.url+"/site/getCampaigns?auth="+this.parent.user.auth.data).then(function(response){
                self.data = response.data;
                self.loader = 0;
            }).catch(function(error){
                self.parent.logout();
            });
        },

        action:function(){
            var self = this;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url+"/site/actionCampaign?auth="+this.parent.user.auth.data).then(function(response){
                self.$refs.new.active=0;
                if(self.parent.formData.id){
                    self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
                }else{
                    self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
                }

                self.get();
            }).catch(function(error){
                console.log('errors : ', error);
            });
        },
        del:async function () {
            if(await this.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this campaign?")){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url+"/site/actionCampaign?auth="+this.parent.user.auth.data).then(function(response){
                    if(response.data.error){
                        self.$refs.header.$refs.msg.alertFun(response.data.error);   
                    }else{
                    self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                    self.get();
                    }
                }).catch(function(error){
                    console.log('errors : ', error);
                });
            }
        },
    },
template: `
<div class="inside-content">

    <Header ref="header"/>

    <div class="wrapper campaigns-wrap">

        <div class="campaigns-top">

<nav class="top-nav">
    <div class="nav-left">
        <a href="#" class="nav-btn logout" @click.prevent="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </div>

    <div class="nav-center">
        <a href="#/users"
           class="nav-link"
           :class="{ active: $route.path.includes('users') }">
            Users
        </a>

        <a href="#/campaigns"
           class="nav-link"
           :class="{ active: $route.path.includes('campaigns') }">
            Campaigns
        </a>
    </div>

    <div class="nav-right">
        <img src="img/logo.png" alt="Logo" class="logo">
    </div>
</nav>

            <div class="top-left">
                <button class="btn btn-small" @click="$refs.new && ($refs.new.active=1)">
                    + New
                </button>
            </div>

            <div class="top-center">
                <input type="date" v-model="date" @change="get()">
                <span>—</span>
                <input type="date" v-model="date2" @change="get()">
            </div>

            <div class="top-right">
                <h1>Campaigns</h1>
            </div>

        </div>

        <div class="table campaigns-table" v-if="data.items.length">

            <table>
                <thead>
                    <tr>
                        <th class="actions">Actions</th>
                        <th class="id">Fraud</th>
                        <th class="id">Leads</th>
                        <th class="id">Clicks</th>
                        <th class="id">Views</th>
                        <th class="title">Title</th>
                        <th class="id">#</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in data.items" :key="item.id">

                       <td class="actions">
    <a href="#" title="Statistics"
       @click.prevent="$router.push('/campaign/' + item.id)">
        <i class="fas fa-chart-line"></i>
    </a>

    <a href="#" title="Edit"
       @click.prevent="parent.formData = item; $refs.new && ($refs.new.active = 1)">
        <i class="fas fa-edit"></i>
    </a>

    <a href="#" title="Delete"
       @click.prevent="parent.formData = item; del()">
        <i class="fas fa-trash"></i>
    </a>
</td>


                        <td class="id">{{ item.fclicks || 0 }}</td>
                        <td class="id">{{ item.leads || 0 }}</td>
                        <td class="id">{{ item.clicks || 0 }}</td>
                        <td class="id">{{ item.views || 0 }}</td>

                        <td class="title">
                            <router-link :to="'/campaign/' + item.id">
                                {{ item.title }}
                            </router-link>
                        </td>

                        <td class="id">{{ item.id }}</td>

                    </tr>
                </tbody>
            </table>

        </div>

        <div class="empty" v-else>
            No campaigns
        </div>

    </div>
</div>
`
};  




