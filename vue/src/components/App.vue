<template>
  <div id="app">
    <h1>Family Tree</h1>
    <input v-model="personName" placeholder="Enter person's name" />
    <button @click="fetchPerson">Fetch Person</button>
    <div v-if="person">
      <h2>{{ person.name }}</h2>
      <h3>Parents:</h3>
      <ul>
        <li v-for="parent in person.parents" :key="parent._id">{{ parent.name }}</li>
      </ul>
      <h3>Siblings:</h3>
      <ul>
        <li v-for="sibling in person.siblings" :key="sibling._id">{{ sibling.name }}</li>
      </ul>
      <h3>Children:</h3>
      <ul>
        <li v-for="child in person.children" :key="child._id">{{ child.name }}</li>
      </ul>
      <h3>Cousins:</h3>
      <ul>
        <li v-for="cousin in person.cousins" :key="cousin._id">{{ cousin.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      personName: '',
      person: null
    };
  },
  methods: {
    async fetchPerson() {
      try {
        const response = await axios.get(`/persons/${this.personName}`); 
        this.person = response.data;

        // Fetch related persons (parents, siblings, children, cousins)
        await this.populateRelatives(this.person.parents, 'parents');
        await this.populateRelatives(this.person.siblings, 'siblings');
        await this.populateRelatives(this.person.children, 'children');
        await this.populateRelatives(this.person.cousins, 'cousins');
      } catch (error) {
        console.error('Error fetching person:', error.response ? error.response.data : error.message);
      }
    },
    async populateRelatives(ids, type) {
      if (!ids || ids.length === 0) return;

      const relatives = [];
      for (const id of ids) {
        try {
          const response = await axios.get(`/persons/${id}`);
          relatives.push(response.data);
        } catch (error) {
          console.error(`Error fetching ${type}:`, error.response ? error.response.data : error.message);
        }
      }
      this.$set(this.person, type, relatives);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
