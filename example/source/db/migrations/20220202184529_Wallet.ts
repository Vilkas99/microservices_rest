import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('administrators', function(table) {
        table.uuid('id').primary(); 
        table.string('name').notNullable();
        table.string('last_name').notNullable();
        table.string('mother_last_name').notNullable();
        table.decimal('total_debt').notNullable();
        table.decimal('total_pending').notNullable();
        table.timestamps(true, true);
    })
    .createTable('consultants', function(table) {
        table.uuid('id').primary(); 
        table.uuid('id_admin').references('id').inTable('administrators').onDelete("SET NULL");
        table.enum('type', ["CONSULTANT", "DISTRIBUTOR", "CONSULTANT_NO_RFC"]).notNullable();;
        table.string('name').notNullable();
        table.string('last_name').notNullable();
        table.string('mother_last_name').notNullable();
        table.decimal('total_pending_payment').notNullable();
        table.decimal('total_debts').notNullable();
        table.integer('total_products').notNullable();
        table.decimal('total_earnings').notNullable();
        table.decimal('current_points').notNullable();
        table.timestamps(true, true);
    })
    .createTable('debts', function(table) {
        table.uuid('id').primary(); 
        table.uuid('id_consultant').references('id').inTable('consultants').onDelete("SET NULL"); 
        table.uuid('id_admin').references('id').inTable('administrators').onDelete("SET NULL");
        table.decimal('amount').notNullable();
        table.date('payment_date');
        table.date('max_date').notNullable();
        table.enum('debt_from', ["ADMIN", "CONSULTANT"]).notNullable();
        table.enum('debt_type', ["COMMISSION", "CASHBACK"]).notNullable();
        table.enum('status', ["PAYED", "PENDING"]).notNullable();
        table.timestamps(true, true);
    })
    .createTable('modifications', function(table) {
        table.uuid('id').primary();
        table.uuid('id_parent').notNullable()
        table.uuid('id_consultant').references('id').inTable('consultants').onDelete("SET NULL");
        table.enum('parent_type', ["ADMIN", "ORDER", "DEBT"]).notNullable();
        table.enum('operation_type', ["ADD", "DECREASE", "SET"]).notNullable();
        table.enum('element_type', ["CREDIT", "POINTS", "MONEY", "PRODUCTS"]).notNullable();
        table.timestamps(true, true);
    })
    .createTable('credit', function(table) {
        table.uuid('id').primary();
        table.uuid('id_distributor').references('id').inTable('consultants').onDelete("CASCADE");
        table.date('payment_date').notNullable();
        table.decimal('total').notNullable();
        table.decimal('current').notNullable();
        table.timestamps(true, true);
    })
    .createTable('orders', function(table) {
        table.uuid('id').primary();
        table.uuid('id_consultant').references('id').inTable('consultants').onDelete("SET NULL");
        table.integer('total_products').notNullable();
        table.decimal('total_payment').notNullable();
        table.decimal('credit'); 
        table.decimal('points');
        table.decimal('money'); 
        table.date('purchase_date').notNullable();
        table.enum('purchase_type', ["PERSONAL", "SELLING"]).notNullable();
        table.json('products').notNullable();
        table.enum('direct_percentage', ["DIST_CON", "CON_CON", "DIST_DIST"]).notNullable(); 
        table.enum("indirect_percentage", ["INDIRECT_DIST", "INDIRECT_LOCATION", "INDIRECT_INDEPENDENT"]);
        table.enum("status", ["PENDING", "PAYED", "CANCELED"]);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTableIfExists('orders')
    .dropTableIfExists('credit')
    .dropTableIfExists('debts')
    .dropTableIfExists('modifications')
    .dropTableIfExists('receipts')
    .dropTableIfExists('consultants')
    .dropTableIfExists('administrators');
}

