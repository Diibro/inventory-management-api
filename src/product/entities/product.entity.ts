import { Check, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Check("QUANTITY_NON_NEGATIVE_chk",`"quantity" >= 0`)
@Check("EMPTY_NAME_CHECK", `LENGTH("name") > 0`)
@Check("EMPTY_CATEGORY_CHECK", `LENGTH("category") > 0`)
export class Product {
     @PrimaryGeneratedColumn('uuid')
     id: string

     @Column({unique:true,nullable:false})
     name: string

     @Column()
     quantity: number

     @Column({nullable:false})
     category: string
}
