// ... No POST
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        categoryId: body.categoryId, // Agora usamos o ID direto
        available: body.available,
        optionGroups: {
          create: body.optionGroups?.map((group: any) => ({
            name: group.name,
            options: { create: group.options?.map((opt: any) => ({ name: opt.name, price: opt.price || 0 })) }
          })) || []
        }
      }
    })