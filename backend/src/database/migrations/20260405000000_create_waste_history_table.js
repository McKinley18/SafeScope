/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema.createTable('waste_history', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('item_name').notNullable();
    table.string('category').notNullable();
    table.string('reason').notNullable();
    table.decimal('estimated_value', 12, 2).notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('waste_history');
};
