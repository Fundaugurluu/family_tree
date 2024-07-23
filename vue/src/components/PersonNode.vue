<template>
  <div class="person-node">
    <div class="person-info">
      <h2>{{ person.name }}</h2>
    </div>
    <div v-if="person.parents.length > 0" class="relations parents">
      <h3>Parents:</h3>
      <div class="relations-list">
        <PersonNode v-for="parent in person.parents" :key="parent._id" :person="parent" />
      </div>
    </div>
    <div v-if="person.siblings.length > 0" class="relations siblings">
      <h3>Siblings:</h3>
      <div class="relations-list">
        <PersonNode v-for="sibling in person.siblings" :key="sibling._id" :person="sibling" />
      </div>
    </div>
    <div v-if="person.children.length > 0" class="relations children">
      <h3>Children:</h3>
      <div class="relations-list">
        <PersonNode v-for="child in person.children" :key="child._id" :person="child" />
      </div>
    </div>
    <div v-if="person.cousins.length > 0" class="relations cousins">
      <h3>Cousins:</h3>
      <div class="relations-list">
        <PersonNode v-for="cousin in person.cousins" :key="cousin._id" :person="cousin" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonNode',
  props: {
    person: Object
  }
};
</script>

<style scoped>
.person-node {
  margin: 10px;
}
.person-info {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.relations {
  margin-top: 10px;
}
.relations-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.parents {
  margin-bottom: 20px; /* Parents will be on top */
}
.siblings {
  margin-bottom: 20px; /* Siblings will be in the middle */
}
.children {
  margin-bottom: 20px; /* Children will be at the bottom */
}
.cousins {
  margin-bottom: 20px; /* Cousins can be displayed separately if needed */
}
</style>
