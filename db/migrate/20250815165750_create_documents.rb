class CreateDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :documents do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :content_type
      t.bigint :byte_size
      t.boolean :compressed, default: false
      t.string :public_token

      t.timestamps
    end
    add_index :documents, :public_token
  end
end
